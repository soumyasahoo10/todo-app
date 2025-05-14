export default function Scroll({contact}) {
    return(
        <div className="w-full h-0.5">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                {contact.profilepic ? (
                    <img
                    src={contact.profilepic}
                    alt="profile"
                    className="w-full h-full object-cover" 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white bg-gray-500">
                        <span className="text-sm">👤</span>
                    </div>
                )}
            </div>
        </div>
    )
}