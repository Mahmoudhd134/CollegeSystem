import GroupsContainer from "../Components/Dashboard/GroupsContainer";
import Group from "../Components/Dashboard/Group";
import {GroupTitle} from "../Components/Dashboard/GroupTitle";
import GroupLinksContainer from "../Components/Dashboard/GroupLinksContainer";
import {GroupLink} from "../Components/Dashboard/GroupLink";

const AdminDashboard = () => {

    return (<div className={'container mx-auto p-4 min-h-remaining'}>
        <GroupsContainer>
            <Group>
                <GroupTitle>Doctors!</GroupTitle>
                <GroupLinksContainer>
                    <GroupLink to={'/Doctor/List'}>Doctors List</GroupLink>
                    <GroupLink to={'/Doctor/Add'}>Add New</GroupLink>
                </GroupLinksContainer>
            </Group>

            <div
                className="border border-blue-700 p-5 w-full sm:w-5/12 rounded-xl bg-blue-200 hover:shadow hover:shadow-blue-200">
                <h3 className="text-center text-blue-800 text-3xl sm:text-2xl">Subjects!</h3>
                <div className="flex justify-between mt-3">
                    <GroupLink to={'/subject'}>Subjects List</GroupLink>
                    <GroupLink to={'/'}>Add New</GroupLink>
                </div>
            </div>
        </GroupsContainer>
    </div>)
}

export default AdminDashboard