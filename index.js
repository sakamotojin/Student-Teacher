function setname(){
    let name = document.getElementById("name").value;
    let rollno = document.getElementById("rno").value;
    document.cookie = "name" + "=" + name + ";" +"rollno" + "=" + rollno + ";";
}