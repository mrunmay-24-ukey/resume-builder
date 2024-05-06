import { useQuery } from "react-query"
import { getTemplates } from "../api";
import { toast } from "react-toastify";


const useTemplates = () => {
    const {data , isLoading , isError , refetch} = useQuery(
        "templates" ,
        async () => {
            try{
                const templates = await getTemplates();
                return templates;

            }
            catch(error){
                console.log(error);
                toast.error("Something went wrong");
            }
        } ,
        {refetchOnWindowFocus : false}
    );
    return {
        data , isError ,isLoading , refetch
    }
}   

export default useTemplates;