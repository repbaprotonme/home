#cp ../data/HOME.0*.jpg .
#./avif2jpg.sh
#./webp2jpg.sh
for image in *.avif; do convert $image -resize x360 $image; done
for image in *.avif; do convert $image -resize 360x360^ -gravity north -extent 360x360 $image; done 
convert *.avif -append IYBA.avif
convert IYBA.avif IYBA.jpg


