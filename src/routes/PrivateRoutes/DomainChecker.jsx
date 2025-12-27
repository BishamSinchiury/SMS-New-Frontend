import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsonApi from "@/api/json";

export default function DomainChecker({children}) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkOrg = async () => {
            console.log("Checking organization...");
            const cached = sessionStorage.getItem("orgStatus");
            if (cached) {
                const data = JSON.parse(cached);
                if (!data.orgProfileExists){
                    navigate("/org-setup", {replace: true});
                }
                setLoading(false);
                return;
            }
            try {
                const domain = window.location.hostname;
                const response = await jsonApi.get(`/org/check-org/?domain_name=${domain}`);
                console.log(response.data);
            } catch (err) {
                console.error("Error checking organization:", err);
            } finally {
                console.log("Organization check completed.");
            }
            };
        checkOrg();
        }, []);
}
