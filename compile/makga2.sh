#./makga2.sh COMIC "Book" TALE.* > gallary.json
#perl -MJSON -e '@text=(<>);print to_json(from_json("@text", {relaxed=>1}), {pretty=>1})' gallary.json

echo "{"

echo "     \"template\": \"$1\"," 
echo "     \"title\": \"$2\","
echo "     \"data\":"
echo "     ["

for f in "$@"
do
    
    identify $f 2> error | gawk '{split($1,name,"."); split($3,sizes,"x"); print "          [\""name[1]"."name[2]"\",", sizes[1]",", sizes[2]"],"}' 

done

echo "     ]"
echo "}"





#


