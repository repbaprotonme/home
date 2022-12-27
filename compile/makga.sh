#./makegallery.sh COMIC " " > AGEN.json
#
echo "{"

echo "     \"template\": \"$1\"," 
echo "     \"title\": \"$2\","
echo "     \"data\":"
echo "     ["

identify *.jpg *.webp *.avif 2> error | gawk '{split($3,sizes,"x"); print "          [\""$1"\",", sizes[1]",", sizes[2]"],"}' 

echo "     ]"
echo "}"


