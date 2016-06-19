let camelize = str => str.replace(/-\w/g, match => match[1].toUpperCase());

let parsePropertyBinding = attr => {
    // bd-foo-bar="alice.bob" => {name: 'fooBar', target: 'alice', path: ['bob']}
    let path = attr.value.trim().split('.');
    return {
        name: camelize(attr.name.substring(3)),
        target: path[0],
        path: path.slice(1)
    };
};

let parseEventBinding = attr => {
    let expression = attr.value.trim();
    let functionBody = expression.includes('(')
        ? '$this.' + expression
        : '$this.' + expression + '($event)';
    let handler = new Function('$this', '$event', functionBody);

    return {
        name: attr.name.substring(3),
        handler: handler
    };
};

export default element => {
    let attributes = Array.from(element.attributes);

    let properties = attributes.filter(({name}) => name.startsWith('bd-')).map(parsePropertyBinding);
    let events = attributes.filter(({name}) => name.startsWith('on-')).map(parseEventBinding);

    return {properties, events};
};
