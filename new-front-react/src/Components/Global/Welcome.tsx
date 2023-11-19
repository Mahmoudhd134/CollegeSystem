const Welcome = ({path}: { path: string }) => {
    return <div className={'my-container'}>
        This Is Waiting Page
        <div>We Are Getting {path} For You</div>
    </div>
};

export default Welcome;