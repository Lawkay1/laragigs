import { Link } from "react-router-dom"
export default function TButton({
    color = "indigo",    
    to = '',
    href='',
    circle = false,
    link = false,
    children,
    target = "_blank",
    onClick = () => {},
}) {

    let classes = [
        "flex",
        "items-center",
        "whitespace-nowrap",
        "text-sm",
        "border",
        "border-2",
        "border-transparent",
    ]

    if (link) {
        classes = [
            ...classes,
            "transition-colors",
        ];  
        
        switch (color) {
            case "indigo":
                classes = [
                    ...classes,
                    "text-indigo-500",
                    "focus:border-indigo-500",
                ];
                break;
            case "red":
                classes = [
                    ...classes,
                    "text-red-500",
                    "focus:border-red-500",
                ];
                break;
        }
    } else {
       classes = [
           ...classes,
           "text-white",
           "focus:ring-2",
           "focus:ring-offset-2",
       ] ;
       switch (color) {
        case "indigo":
            classes = [
                ...classes,
                "text-indigo-500",
                "focus:border-indigo-500",
            ];
            break;
        case "red":
            classes = [
                ...classes,
                "bg-red-600",
                "hover:bg-red-700",
                "focus:ring-red-500",
            ];
            break;
        case "green":
            classes = [
                ...classes,
                "bg-emerald-500",
                "hover:emerald-600",
                "focus:ring-emerald-400",
            ];
            break;
        
    }

    if (circle) {
        classes = [
            ...classes,
            "rounded-full",
            "w-8",
            "h-8",
            "p-0",
            "flex",
            "items-center",
            "justify-center",
        ];

    } else {
        classes = [
            ...classes,
            "rounded-md",
            "px-4",
            "py-2",
            "p-0",
        ];
    }
    return (
        <>
        {href && (<a href={href} className={classes.join(" ")} target={target}>{children}</a>)} 
         {to && (<Link to={to} className={classes.join(" ")}>{children}</Link>)}
         {!to && !href && (<button onClick={onClick} className={classes.join(" ")}>{children}</button>)}
        </>
        
    )
}}