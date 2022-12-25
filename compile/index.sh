#cp ../data/HOME.0*.jpg .
#./avif2jpg.sh
#./webp2jpg.sh
#for image in *.jpg; do convert $image -resize x360 $image; done
#for image in *.jpg; do convert $image -resize 360x360^ -gravity north -extent 360x360 $image; done 
convert DOLL.*.jpg -append DOLL.jpg
#convert GIRL.webp GIRL.jpg 


