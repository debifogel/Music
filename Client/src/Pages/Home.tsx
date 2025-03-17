
import AwsUpload from '@/components/AwsUpload';
import FormToEnter from '../components/FormToEnter';
export default function Home() {
 
  return (
    <>
    <FormToEnter buttonText="הרשמה" onSubmit={(email,password,name)=>{console.log(email
,password,name)}} register={true}/>
<FormToEnter buttonText="התחברות" onSubmit={(email,password)=>
console.log(password,email)} register={false}/>
 <AwsUpload/>
    </>
  )
}
