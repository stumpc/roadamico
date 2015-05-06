# RoadAmico

[![Build Status](https://travis-ci.org/camman3d/RoadAmico.svg)](https://travis-ci.org/camman3d/RoadAmico)

View the site at: https://www.roadamico.com/

## Requirements

> The following instructions are based on Mac OS X and Homebrew.

* Git (`brew install git`)
* Node.js/NPM (`brew install node`)
* Ruby/Gem (`brew install ruby`)
* Yeoman (`npm install -g yo`)
* Bower (`npm install -g bower`)
* Grunt (`npm install -g grunt-cli`)
* MongoDB (`brew install mongodb`)

## Installation

First clone the repo:

```
git clone https://github.com/camman3d/RoadAmico.git
cd RoadAmico
```

Then, install the deps:

```
npm install
bower install
gem install sass
```

## Running

Requires MongoDB to be running on localhost:

```
mkdir data
mongodb --dbpath ./data
```

You can run the application with the `serve` Grunt task:

```
grunt serve
```
