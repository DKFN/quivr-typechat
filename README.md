# quivr-typechat : Use typechat with your Quivr instance

## Introduction

This is a little plugin that allows you to use a [Quivr](https://github.com/StanGirard/quivr) instance with [TypeChat](https://github.com/microsoft/TypeChat).

My research goal is to use Quivr in the middle of the LLM to use the Knowledge Base of the Brain to influence the response of Typechat. And the first step is this plugin :)

It is also a great way to use Typechat with not yet officially supported models like GPT4ALL / VertexAI / Anthropic using Quivr as an abstraction layer !

Contributions and ideas are very welcome

## Installation

The package is available on [NPM](https://www.npmjs.com/package/quivr-typechat)
You can install it using NPM or your favorite package manager, example:
```sh
npm install --save quivr-typechat
```

## Usage
On your code replace the Typechat `createLanguageModel` function with `createQuivrLanguageModel`

Instead of

```ts
import {createLanguageModel} from "typechat";

const model = createLanguageModel(process.env);
```

Use
```ts
import {createQuivrLanguageModel} from "quivr-typechat";

const model = createQuivrLanguageModel(process.env);
```

You will need to define two new variables in the .env file or in the environnement:
```env
QUIVR_API_KEY="<your_quivr_key_here>"
QUIVR_BRAIN_ID="<brain_to_use_in_the_program>"
```

You can also specify parameters available for Quivr, here is a complete example of the `createQuivrLanguageModel` function:
```ts
const model = createQuivrLanguageModel(process.env, {
    endpoint: "http://localhost:5050",
    model: "gpt-3.5-turbo-16k",
    max_tokens: 2048
});
```

I hope this plugin would be as usefullfor you as it is for me ! :)

## Notice

This is an experimental plugin on top on an experimental library, it's fun to mess with it, but don't put it anywhere near your production !

## Planned features
- [ ] Handle retries like specified by Typechat
- [ ] Ability to set a brain per model
- [ ] Leverage the knowledge base when using Quivr
- [ ] Remove code duplication when more tooling would be available publicly
- [ ] Make verbosity optional instead of default
- [ ] Make Quivr endpoint available via environnement variable
- [ ] Tests ! (Forgive me, it's 2:35 and I could not have guessed it would have been so fun to tinker with :D )
- [ ] Build and publish on NPM on main commit with code changes
