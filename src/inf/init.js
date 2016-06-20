import u from 'underscore';
import ui from 'esui';
import parse from './parse';
import {merge} from 'diffy-update';

let addHooks = options => {
    let inputSource = options.owner || options.inputSource;
    let outputSource = options.owner || options.outputSource;

    let hooks = {
        onBuildOptions(options) {
            let bindings = parse(options.main);
            let {properties, events} = bindings;

            if (!properties.length && !events.length) {
                return options;
            }

            let initialProperties = properties.reduce(
                (result, {name, target, path}) => {
                    let value = path.reduce((value, property) => value[property], inputSource.get(target));
                    return Object.assign(result, {[name]: value});
                },
                {}
            );
            return merge(options, null, {bindings, ...initialProperties});
        },

        onCreateControl(control) {
            control.on(
                'initchildren',
                e => e.options = addHooks(e.options)
            );

            if (!control.bindings) {
                return;
            }

            let propertyBindingIndex = u.indexBy(control.bindings.properties, 'target');
            if (control.owner) {
                control.owner.on(
                    'propertyset',
                    ({target, changes}) => {
                        let awareChanges = changes.filter(({name}) => propertyBindingIndex.hasOwnProperty(name));
                        let properties = awareChanges.reduce(
                            (result, {name, newValue}) => {
                                let binding = propertyBindingIndex[name];
                                let value = binding.path.reduce((value, property) => value[property], newValue);
                                return Object.assign(result, {[binding.name]: value});
                            },
                            {}
                        );
                        control.setProperties(properties);
                    }
                );
            }
            else {
                // inputSource.on('change', ({name, newValue}) => control.set(name, newValue));
                // TODO: 处理Model的case
            }

            for (let {name, handler} of control.bindings.events) {
                control.on(name, event => handler(outputSource, event));
            }
        }
    };

    return merge(options, null, hooks);
};

export default (container, customOptions) => {
    let options = addHooks(customOptions || {});
    return ui.init(container, options);
};
