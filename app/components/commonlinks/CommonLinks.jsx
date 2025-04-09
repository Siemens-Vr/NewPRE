export default function CommonLinks() {
    const links = [
        { name: "Equipment", url: "/pages/equipment/dashboard"},
        { name: "Projects", url: "/pages/project/dashboard" },
        { name: "Student", url: "/pages/student/dashboard" },
        { name: "Staff", url: "/pages/admin/dashboard/staff" },
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mt-1.5">
            <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
            <div className="grid grid-cols-2 gap-4">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg text-center transition duration-300 hover:bg-[#c6e7e7]"
                    >
                        {link.name}
                    </a>
                ))}
            </div>
        </div>
    );
}
