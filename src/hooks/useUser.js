import { useQuery } from "react-query";
import { getUserDetails } from "../api";

const useUser = () => {

    // useQuery('statename' , () => {});
    const { data, isLoading, isError, refetch } = useQuery('user', async () => {  
        
        try {
            const userDetails = await getUserDetails();
            return userDetails;
        } catch (error) {
           if(!error.message.includes("not authenticated")){
            toast.error("Something went wrong");
           } 
        }

    }, {
        refetchOnWindowFocus:false
    })
    return {data , isLoading , isError , refetch}
}


export default useUser;
    