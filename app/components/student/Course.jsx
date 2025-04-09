


const enrolledCourses = [
    'simens 1',
    'simens 1',
];


const EnrolledCourses = () => {
    // const [courses, setCourses] = useState([]);


    return (
        <div className="bg-peach-100 rounded-xl shadow p-4 col-span-1">
            <h3 className="font-semibold mb-2">Enrolled courses</h3>
            <ul>
                {enrolledCourses.map((course, index) => (
                    <li key={index}>
                        {index + 1}. {course}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EnrolledCourses;
