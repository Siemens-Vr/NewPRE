const instructors = [
    {
        name: "Instructor One",
        img: "/instructor1.jpg", // update paths
    },
    {
        name: "Instructor Two",
        img: "/instructor2.jpg",
    },
    {
        name: "Instructor Three",
        img: "/instructor3.jpg",
    },
];

const InstructorsAndNotice = () => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-md mx-auto mt-6 space-y-6">
            {/* Instructors */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Course Instructors</h3>
                <div className="flex items-center space-x-4">
                    {instructors.map((inst, index) => (
                        <img
                            key={index}
                            src={inst.img}
                            alt={inst.name}
                            className="w-12 h-12 rounded-full border-2 border-orange-500 object-cover"
                        />
                    ))}
                </div>
            </div>

            {/* Daily Notice */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Daily Notice</h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="font-bold text-gray-800">payment due</p>
                        <p className="text-gray-600">Cohort 3 exams payment date.</p>

                    </div>
                    <div>
                        <p className="font-bold text-gray-800">Exam schedule</p>
                        <p className="text-gray-600">Cohort 3 exams schedule to begin next week.</p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorsAndNotice;
