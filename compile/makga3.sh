./makga2.sh COMIC "Book" TALE.* > gallary.json
perl -MJSON -e '@text=(<>);print to_json(from_json("@text", {relaxed=>1}), {pretty=>1})' gallary.json 






#


