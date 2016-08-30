# create a zip file for deploying
zip_name='eb_autogen.zip'

eb_config_file='.elasticbeanstalk/config.yml'

if [ ! -e $eb_config_file ]
then
	echo 'elastic beanstalk is not initialized in this directory, try running `eb init`';
	exit 2;
fi

if ! egrep $zip_name $eb_config_file ;
then
	echo "elastic beanstalk is not set to deploy from $zip_name";
	echo "please append the following to $eb_config_file:

deploy:
  artifact: $zip_name";
	exit 3;
fi

rm -v $zip_name
zip -r $zip_name app.js node-client/ node-provider/ shared/ package.json

# get the current version id
version_id=$( eb status | grep 'Deployed\ Version' | cut -d' ' -f5 )
version_num=$( echo $version_id | egrep -o '[0-9]+' )
next_version_num=$(( $version_num + 1 ))
next_version=app-v$next_version_num

echo 'Current Version =' $version_id
echo 'Next Version =' $next_version

# deploy to elasticbeanstalk
eb deploy -l $next_version
