# SHERLOCK

## Introduction

This repository contains the source code for the ITA project's SHERLOCK game for Controlled English experiments.

The game uses the CENode library to maintain a knowledge base, which is described purely in ITA Controlled English.

For more information on the ITA project and CENode, take a look at the following webpages:

* [dais-ita.org/pub](https://dais-ita.org/pub)
* [cenode.io](http://cenode.io)

## Running the game

### Getting started

The easiest way to run the game is to use Docker:

```
docker run -p 80:80 flyingsparx/sherlock
```

Then navigate to [localhost](http://localhost) to start the game using the default Sherlock 'world' in an isolated environment.

### Extending the game's world

To enable users to start the game with more context, extra models can be passed, where each model is described by a JavaScript array of pure CE sentences inside a global variable named `CUSTOM_MODEL`.

For example, the following model can be used to tell CENode that there is such a thing called a 'movie', and that there is a movie called Harry Potter:

```javascript
var CUSTOM_MODEL = [
  "conceptualise a ~ movie ~ M",
  "there is a movie named 'Harry Potter'"
];
```

To start a new Sherlock game such that its world contains this information, we can pass it into the Docker container (given the model is saved in a file called `harry_potter.js`):

```
docker run -p 80:80 -v ${PWD}/harry_potter.js:/models/custom.js flyingsparx/sherlock
```

### Use case: multiplayer

CENode supports inter-node communication out-of-the-box, through use of [policies](https://github.com/willwebberley/CENode/wiki/Policies). Since policies are again described by pure CE, a multiplayer game can be set-up through a relay CENode instance using the same `CUSTOM_MODEL` setup.

For example, given a relay CENode instance is configured at `http://mycenode.com`, the relevant policies can be described in a file called `multiplayer.js`:

```javascript
var CUSTOM_MODEL = [
  "there is an agent named 'RemoteAgent' that has 'mycenode.com' as address",
  "there is a tell policy named 'p2' that has 'true' as enabled and has the agent 'RemoteAgent' as target",
  "there is a listen policy named 'p4' that has 'true' as enabled and has the agent 'RemoteAgent' as target"
];
```

And this can be passed into the Docker container as before to enable players of the game to exist in the same 'world':

```
docker run -p 80:80 -v ${PWD}/multiplayer.js:/models/custom.js flyingsparx/sherlock
```

The policies on the node mean that the game allows players to continue even when they have no network connectivity. The games will sync up as individual players leave and join the network.

To set-up a simple CENode relay, take a look at the [CENode Explorer project](https://github.com/willwebberley/CENode-explorer).

## Licensing

The contents of this repository are licensed under the Apache License v2. See LICENSE for further information.
