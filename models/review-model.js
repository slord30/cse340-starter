const pool = require("../database/")

/* ************************
 *  Week 6 - Final Assignment
 *  Add a new review
 *  ***********************/
async function addReview(review_text, inv_id, account_id) {
    try {
        const sql = `
            INSERT INTO review (review_text, inv_id, account_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        return await pool.query(sql, [review_text, inv_id, account_id]);
    }   catch(error) {
        return error;
    }
}

/* ************************
 *  Week 6 - Final Assignment
 *  Get review by inventory id
 *  ***********************/
async function getReviewsByInventoryId(inv_id) {
    try {
        const sql = `
            SELECT 
                r.review_id,
                r.review_text, 
                r.review_date, 
                a.account_firstname, 
                a.account_lastname, 
                a.account_id
            FROM public.review r
            INNER JOIN public.account a
                ON r.account_id = a.account_id
            WHERE r.inv_id = $1
            ORDER BY r.review_date DESC
        `;
        return await pool.query(sql, [inv_id]);
    }   catch(error) {
        return error;
    }
}

/* ************************
 *  Week 6 - Final Assignment
 *  Get review by account id
 *  ***********************/
async function getReviewsByAccountId(account_id) {
    try {
        const sql = `
            SELECT
                r.review_id,
                r.review_text,
                r.review_date,
                i.inv_make,
                i.inv_model,
                i.inv_year,
                i.inv_id
            FROM public.review r
            INNER JOIN public.inventory i
                ON r.inv_id = i.inv_id
            WHERE r.account_id = $1
            ORDER BY r.review_date DESC           
        `;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
    }   catch(error) {
            console.error("getReviewsByAccountId error" + error)
            return error;
    }  
}

/* ************************
 *  Week 6 - Final Assignment
 *  Update Review
 *  ***********************/
async function updateReview(review_text, review_id, account_id) {
    try {
        const sql = `
            UPDATE public.review SET review_text = $1
            WHERE review_id = $2 AND account_id = $3
            RETURNING *
        `;
        return await pool.query(sql, [review_text, review_id, account_id])
    }   catch (error) {
        return error;
    }
}

/* ************************
 *  Week 6 - Final Assignment
 *  Delete Review
 *  ***********************/
async function deleteReview(review_id, account_id) {
    try {
        const sql = `
            DELETE FROM public.review WHERE review_id = $1 AND account_id = $2
        `;
        return await pool.query(sql, [review_id, account_id])
    }   catch(error) {
        return (error);
    }
}

module.exports = {
    addReview, 
    getReviewsByInventoryId, 
    getReviewsByAccountId, 
    updateReview, 
    deleteReview,
    getReviewById
};

/* ************************
 *  Week 6 - Final Assignment
 *  Get reviews by review id
 *  ***********************/
async function getReviewById(review_id) {
    try {
        const sql = `
            SELECT
                r.*,
                i.inv_make,
                i.inv_model,
                i.inv_year
            FROM public.review r
            INNER JOIN public.inventory i
                ON r.inv_id = i.inv_id
            WHERE r.review_id = $1
        `;
        const result = await pool.query(sql, [review_id]);
        return result.rows[0]
    }   catch (error) {
        return error.message
    }
}