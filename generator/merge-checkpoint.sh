mkdir -p ./merge_out
find ./p1_out -type f -exec cp {} ./merge_out \;
find ./p2_out -type f -exec cp {} ./merge_out \;
find ./p3_out -type f -exec cp {} ./merge_out \;
