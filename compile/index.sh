#cp ../data/HOME.0*.jpg .
./webp2jpg.sh
for image in *.jpg; do convert $image -resize x280 $image; done
for image in *.jpg; do convert $image -resize 280x280^ -gravity north -extent 280x280 $image; done 
convert *.jpg -append ../data/DESH.jpg


