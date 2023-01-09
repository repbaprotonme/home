#./makemenu AGEN
#
#./avif2jpg.sh
#./webp2jpg.sh
#for image in *.jpg; do convert $image -resize x480 $image; done
#for image in $1.*.jpg; do convert $image -resize 360x360^ -gravity north -extent 360x360 $image; done 
for image in *.jpg; do convert $image -resize 465x480^ -gravity north -extent 465x480 $image; done 
#convert $1.*.jpg -append $1.jpg


