import {
    storiesOf,
    setAddon,
    addDecorator,
    addParameters,
    configure,
    getStorybook,
    RenderFunction,
    Story,
    forceReRender,
    DecoratorParameters,
    clearDecorators
} from '@storybook/svelte';

const Decorator = (story: RenderFunction) => `<div>${story()}</div>`;
const parameters: DecoratorParameters = { parameter: 'foo' };

const story = {
    Component: () => "<button>some text</button>",
    props: {
      buttonText: 'some text',
    },
};

forceReRender();

storiesOf('Welcome', module)
    // local addDecorator
    .addDecorator(Decorator)
    .add('to Storybook', () => story)
    .add('to Storybook as Array', () => [story, story])
    .add('and a story with additional parameters', () => story, parameters);

// global addDecorator
addDecorator(Decorator);
addParameters(parameters);
clearDecorators();

// setAddon
interface AnyAddon {
    addWithSideEffect<T>(this: Story & T, storyName: string, storyFn: RenderFunction): Story & T;
}
const AnyAddon: AnyAddon = {
    addWithSideEffect<T>(this: Story & T, storyName: string, storyFn: RenderFunction): Story & T {
        console.log(this.kind === 'withAnyAddon');
        return this.add(storyName, storyFn);
    }
};
setAddon(AnyAddon);
storiesOf<AnyAddon>('withAnyAddon', module)
    .addWithSideEffect('custom story', () => story)
    .addWithSideEffect('more', () => story)
    .add('another story', () => story)
    .add('to Storybook as Array', () => [story, story])
    .add('and a story with additional parameters', () => story, parameters)
    .addWithSideEffect('even more', () => story);

// configure
configure(() => undefined, module);

// getStorybook
getStorybook().forEach(({ kind, stories }) => stories.forEach(({ name, render }) => render()));
