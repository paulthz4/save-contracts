const {AWSCreds} = require('./.env');
const {PATH} = require('./.env');
// const AWS = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const bucket = new S3({
  accessKeyId: AWSCreds.AWS_ACCESS_KEY_ID,
  secretAccessKey: AWSCreds.AWS_SECRET_ACCESS_KEY,
  region: AWSCreds.AWS_REGION
})

function main(){
  new Promise((resolve, rejects)=>{
    // get list of objects from S3
    const params2 = {
      Bucket: 'webcrs',
      MaxKeys: 100
    };
    bucket.listObjectsV2(params2, (err,data)=>{
      if(err) console.log(err);
      else {
        console.log(data);
        resolve(data.Contents);
      }
    });
    
  }).then(r =>{
    // r is a list of objects from webcrs bucket
    for(const obj of r){
      let parameters = {
        Bucket: 'webcrs',
        Key: obj.Key
      };
      // download each contract from S3 bucket and download file
      bucket.getObject(parameters, (err,data) =>{
        if(err){console.log(err)}
        else {
          // const response = new TextDecoder('base64').decode(data.Body);
          // console.log(data);
          // const path = `C:/Users/johns/Downloads/${obj.Key}.pdf`; 
          const path = `${PATH}/${obj.key}.pdf`;
          // fs.writeFile(path, data.Body, (err)=>{
          //   if(err)
          //     console.log(err);
          //   else{
          //     console.log(`successfully downloaded: ${obj.Key}`)
          //   }
          // })
          fs.writeFileSync(path, data.Body);
          console.log(`successfully downloaded: ${obj.Key}`)
        }
      });
    }
    return([...r]);
  })
  .then(r=>{
    for(const obj of r){
      // delete object by key in S3 bucket
      let delParams = {
        Bucket: 'webcrs',
        Key: obj.Key
      };
      bucket.deleteObject(delParams, (err, data) =>{
        if(err){console.log('something went wrong: ', err)}
        else{
          console.log(`successfully deleted: ${obj.Key}`,data);
        }
      });
    }
  });
}

main();
