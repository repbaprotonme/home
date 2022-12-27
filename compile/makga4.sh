#./makega4.sh COMIC Book TALE
./makga2.sh $1 "$2" $3.* > gallary.json
perl -MJSON -e '@text=(<>);print to_json(from_json("@text", {relaxed=>1}), {pretty=>1})' gallary.json 
curl -X PUT -H "Content-Type: application/json" -d @gallery.json https://reportbase.com/gallery/$3
























