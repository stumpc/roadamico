git config --global user.email "haider.mahmood@gmail.com"
git config --global user.name "Haider Mahmood"
echo "Host heroku.com" >> ~/.ssh/config
echo "   StrictHostKeyChecking no" >> ~/.ssh/config
echo "   CheckHostIP no" >> ~/.ssh/config;
echo "   UserKnownHostsFile=/dev/null" >> ~/.ssh/config;
if [[ $TRAVIS_PULL_REQUEST == "false" && $TRAVIS_BRANCH == "development" ]]
  then
    gem install heroku
    echo yes | heroku keys:add
    grunt build
    echo yes | grunt buildcontrol:heroku
    heroku keys:remove `cat ~/.ssh/id_rsa.pub | cut -d \  -f 3`
fi
if [[ $TRAVIS_PULL_REQUEST == "false" ]]
  then
    echo $TRAVIS_BRANCH
fi
echo
echo "...done."
