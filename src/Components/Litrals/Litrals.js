import DownloadActionPlan from "../DownloadActionPlan/DownloadActionPlan";


const litrals = {
    buttons: {
        loginButton: {
            buttonText: "Login",
            variant: "primary",
        },
        startButton: {
            buttonText: "Start",
            variant: "primary",
        },
        nextStep: {
            buttonText: "Next",
            variant: "primary",
        },
        back: {
            buttonText: "Home",
            variant: "primary",
        },
        backNav:{
            buttonText: "Back",
            variant: "primary",
        },
        SubmitNav:{
            buttonText: "Submit",
            variant: "primary",
        },
        DownloadActionPlan:{
            buttonText: "Download Action Plan",
            variant: "primary",
        },
        viewActionPlan:{
            buttonText: "View Action Plan",
            variant: "primary",
        },
        shareOnEmail:{
            buttonText: "Share On Email",
            variant: "primary",
        },
        shareOnWhatsapp:{
            buttonText: "Share On Whatsapp",
            variant: "primary",
        },
        showFeedback:{
            buttonText: "Feedback",
            variant: "primary",
        }


    },
    welcome:{
        heading : "Welcome to Covid-19 Support Finder",
        text1: "The Government, Charities and Community Groups are offering financial and emotional support to those who are finding themselves in stressful and unfamiliar situations.",
        text2: "This Support Finder tool, developed by the University of Edinburgh and Sopra Steria in collaboration with various charities collates information on options available to you based on your circumstances allowing you to stay informed before making big decisions, such as applying for credit.",
        text3: "How does it work?",
        ribbonButtonsPre :["Tell us about yourself","View your options","Know your rights","View you Action Plan","Hear from others"],
        ribbonButtons : [{pretext:"Tell us about yourself",displayText:"We will ask you a few questions about your situation. None of your personal information will be stored or shared."},
                        {pretext:"View your options",displayText:"Based on your responses, we will provide you with a number of free support options and guide you to a set of useful on-line tools."},
                        {pretext:"View your action plan",displayText:"Take a set of actions away with you which will help you today, and in the longer term by building up a stronger financial and emotional resilience."},
                        {pretext:"Hear from others",displayText:"Listen to others tell their stories of how they overcame similar challenges and get some top tips from the experts."}]
    },
    actionPlanPara1 : `Peace of mind, one step at a time.`,
    actionPlanPara2 : "Action plan to manage your vulnerability based on insight from Citizens Advice.",
    gotoHome: "If you go to home page, your current journey will be discarded.\nDo you want to continue?"
};

export default litrals;