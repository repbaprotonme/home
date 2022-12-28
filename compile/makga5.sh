#./makga5.sh COMIC Book BUGS

./makga2.sh $1 "$2" $3.* > gallery.json
./makga4.sh > gallery2.json
curl -X PUT -H "Content-Type: application/json" -d @gallery2.json https://reportbase.com/gallery/$3
























