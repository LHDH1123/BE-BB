module.exports = (objectPage, query, totalProduct) => {
    if(query.page) {
        objectPage.currentPage = parseInt(query.page);
    }
    objectPage.skipItem = (objectPage.currentPage - 1) * objectPage.limitItem;

    const totalPage = Math.ceil(totalProduct / objectPage.limitItem);
    objectPage.totalPage = totalPage;
    return objectPage
}