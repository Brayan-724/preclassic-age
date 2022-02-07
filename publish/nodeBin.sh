
if [ "x$1" == "x" ]; then
	echo "Giorgo's club"
	exit -1;
fi

_TRUE=1
_FALSE=0
ECHO=$_TRUE
nodeLogLevel=error

prefix="\e[32m\e[1m[nodeBin.sh]\e[0m"

if ! [ $1 == "true" ]; then
	ECHO=$_FALSE
	nodeLogLevel=silent
else 
	echo -e " $prefix Running 'nodeBin.sh'..."
fi

if [ $ECHO == $_TRUE ]; then
	echo -e " $prefix Going to '$2'..."
fi

# Go to package directory in /js/published
cd $2 || exit -1

if [ $ECHO == $_TRUE ]; then
	echo -e " $prefix Installing globally..."
fi

# Install package globally
npm install --global --loglevel=${nodeLogLevel} || exit -1

if [ $ECHO == $_TRUE ]; then
	echo -e " $prefix Done"
fi

exit 0
