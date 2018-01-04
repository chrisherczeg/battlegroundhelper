set PATH=%PATH%;C:\Program Files\7-Zip\
echo %PATH%
7z
del index.zip
cd lambda
7z a -r ..\index.zip *
cd ..
aws lambda update-function-code --function-name ItemSkillFunction --zip-file fileb://index.zip
