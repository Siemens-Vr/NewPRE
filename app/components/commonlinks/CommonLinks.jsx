export default function CommonLinks() {
    const links = [
        { name: "Common link", url: "#" },
        { name: "Common link", url: "#" },
        { name: "Common link", url: "#" },
        { name: "Common link", url: "#" },
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mt-2">
            <h2 className="text-lg font-semibold mb-3 textCenter">Quick Links</h2>
            <div className="grid grid-cols-2 gap-4">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg text-center hover:bg-orange-600 transition"
                    >
                        {link.name}
                    </a>
                ))}
            </div>
        </div>
    );
}
