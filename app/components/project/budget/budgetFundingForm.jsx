import React from "react";
import styles from "@/app/styles/project/budget/budgetForm.module.css";

const BudgetFundingForm = ({ newProject, setNewProject }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    };

    // Handle adding new budget items
    const addBudgetItem = () => {
        const newBudgetItems = [...(newProject.budgetItems || []), { description: "", amount: 0 }];
        setNewProject((prev) => ({ ...prev, budgetItems: newBudgetItems }));
    };

    // Handle budget item change
    const handleBudgetItemChange = (index, field, value) => {
        const newBudgetItems = [...(newProject.budgetItems || [])];
        newBudgetItems[index] = { ...newBudgetItems[index], [field]: value };
        setNewProject((prev) => ({ ...prev, budgetItems: newBudgetItems }));
    };

    // Handle deleting a budget item
    const deleteBudgetItem = (index) => {
        const newBudgetItems = (newProject.budgetItems || []).filter((_, i) => i !== index);
        setNewProject((prev) => ({ ...prev, budgetItems: newBudgetItems }));
    };

    // Handle adding new funding items
    const addFundingItem = () => {
        const newFundingItems = [...(newProject.fundingItems || []), { source: "", amount: 0 }];
        setNewProject((prev) => ({ ...prev, fundingItems: newFundingItems }));
    };

    // Handle funding item change
    const handleFundingItemChange = (index, field, value) => {
        const newFundingItems = [...(newProject.fundingItems || [])];
        newFundingItems[index] = { ...newFundingItems[index], [field]: value };
        setNewProject((prev) => ({ ...prev, fundingItems: newFundingItems }));
    };

    // Handle deleting a funding item
    const deleteFundingItem = (index) => {
        const newFundingItems = (newProject.fundingItems || []).filter((_, i) => i !== index);
        setNewProject((prev) => ({ ...prev, fundingItems: newFundingItems }));
    };

    // Calculate totals
    const totalBudget = (newProject.budgetItems || []).reduce((sum, item) => sum + Number(item.amount), 0);
    const totalFunding = (newProject.fundingItems || []).reduce((sum, item) => sum + Number(item.amount), 0);

    return (
        <div className={styles.budgetForm}>
            <h3>Budget</h3>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {(newProject.budgetItems || []).map((item, index) => (
                    <tr key={index}>
                        <td>
                            <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleBudgetItemChange(index, "description", e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => handleBudgetItemChange(index, "amount", e.target.value)}
                            />
                        </td>
                        <td>
                            <button type="button" onClick={() => deleteBudgetItem(index)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button type="button" onClick={addBudgetItem}>
                + Add Budget Item
            </button>
            <div className={styles.total}>Total Budget: ${totalBudget}</div>

            <h3>Funding</h3>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Source</th>
                    <th>Amount</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {(newProject.fundingItems || []).map((item, index) => (
                    <tr key={index}>
                        <td>
                            <input
                                type="text"
                                value={item.source}
                                onChange={(e) => handleFundingItemChange(index, "source", e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => handleFundingItemChange(index, "amount", e.target.value)}
                            />
                        </td>
                        <td>
                            <button type="button" onClick={() => deleteFundingItem(index)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button type="button" onClick={addFundingItem}>
                + Add Funding Item
            </button>
            <div className={styles.total}>Total Funding: ${totalFunding}</div>

        </div>
    );
};

export default BudgetFundingForm;