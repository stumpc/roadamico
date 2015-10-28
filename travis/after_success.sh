git config --global user.email "christian.m.stump@gmail.com"
git config --global user.name "Christian Stump"
echo "Host heroku.com" >> ~/.ssh/config
echo "   StrictHostKeyChecking no" >> ~/.ssh/config
echo "   CheckHostIP no" >> ~/.ssh/config;
echo "   UserKnownHostsFile=/dev/null" >> ~/.ssh/config;
if [[ $TRAVIS_PULL_REQUEST == "false" && $TRAVIS_BRANCH == "development" ]]
  then
    gem install heroku
    export HEROKU_API_KEY=cCRWXVVerlZO76ds1P2HJpSXIBF5fp1NXdKfjdiLbRz8xFqjkCERp0hVl6DQ0fuutSIyJelQxeNEy3iiDdeS4XYy1PMP8Wk6nBbbJvhq0CF0B1vnDSiRKCigsD6w7hDD5das0HhtJog6s+ZMawVJCc44yyyaGv1c6H4vc+u0ozBZKmGZwX9GM3pV58MLmHgwWSckAQpOk0nLEc83CdsFDZ41h6hKsR5KMR9nJFp7xE3k5P+vfHAdeWZQGz0xNMs9XvSLX3GLzZG8EjaNH/Kez7xYFoXhVKsYH7N2nfzO7DFdA/guTZq/Yl47qL39JbHDvpQ6kU024gJBQFf+UemYHixYOonLKSeH6LufyOV1uFfVr/p3sMN7tVxWk1ef7WknGFb77ByRHUimIldgGwGyOcfEGM92/1nWjum31E/4kAOvQYbXxziAj34wRUJp/h8pTFxuYpP9cKldprcJpKjgxt5ZgKITXFJfm9eQbdUkuI3Gr9irFVLhH3w7cF2MxaIIH2rr+WpGiw4Hq1e1r1lP1Aoi+VBH2eyYxYuTUJqHf8qTawRwzsEwaWWex6XRZJu5eHJkif0IUHyb38m9iIhLa8lfRmToFWeyTSU5r4rYuwaVhxaQQuYbGDrWeMxz+ZcSgTTGmeKqFPmaUUlOa1n1bIKgTEmuUpb4tLrw6ISpmjo=
    echo yes | heroku keys:add
    grunt build
    echo yes | grunt buildcontrol:herokuDev
    heroku keys:remove `cat ~/.ssh/id_rsa.pub | cut -d \  -f 3`
fi

if [[ $TRAVIS_PULL_REQUEST == "false" ]]
  then
    echo $TRAVIS_BRANCH
fi
echo
echo "...done."

