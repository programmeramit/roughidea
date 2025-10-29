"use server"
export default async  function displayName(formData:FormData){
    try{
        const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
        console.log(name,email)
        return {name,email}
    }
    catch(err){
        console.log(err)
        throw new Error("faild to display the data ")
    }
}