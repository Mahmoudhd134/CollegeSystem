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
                    <GroupLink to={'/Doctor'}>Doctors List</GroupLink>
                    <GroupLink to={'/Doctor/Add'}>Add New</GroupLink>
                </GroupLinksContainer>
            </Group>

            <Group>
                <GroupTitle>Subjects!</GroupTitle>
                <GroupLinksContainer>
                    <GroupLink to={'/Subject'}>Subjects List</GroupLink>
                    <GroupLink to={'/Subject/add'}>Add New</GroupLink>
                </GroupLinksContainer>
            </Group>

            <Group>
                <GroupTitle>Messages!</GroupTitle>
                <GroupLinksContainer>
                    <GroupLink to={'/Message/Sent'}>Sent</GroupLink>
                    <GroupLink to={'/Message/Received'}>Received</GroupLink>
                </GroupLinksContainer>
            </Group>
        </GroupsContainer>
    </div>)
}

export default AdminDashboard