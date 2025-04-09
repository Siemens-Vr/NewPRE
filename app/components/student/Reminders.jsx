
const reminders = ['Enroll Cohort 2', 'Add level 3' ,'Add level 4' ,'Update cohort4'];

const Reminders = () => {
    return (
        <div className="bg-orange-100 rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Reminders</h3>
            <ul>
                {reminders.map((reminder, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <span>🔔</span> {reminder}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reminders;
