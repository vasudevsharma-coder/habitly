
export default eventHandler(async (event) => {
    const { user } = await requireClerkAuth(event);
    return user;
});
