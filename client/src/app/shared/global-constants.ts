export class GlobalConstants{
 
    //message
    public static genericError : string ="somethins went wrong please try again later";

    public static unauthorized: string = "You are not authorized person to access this page"
    
    public static productExistError: string = "Product already exist"
    public static productAdded: string = "Product Added Successfully"

    //Regex
    public static  nameRegex:string = "[a-zA-Z]{2,30}"

    public static  emailRegex:string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"
  
    public static  contactRegex:string = "^[e0-9]{8,10}$"

    //Variable

    public static err:string ="error"


}
