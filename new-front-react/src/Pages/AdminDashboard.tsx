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
                    <GroupLink to={'/Doctor'}>List</GroupLink>
                    <GroupLink to={'/Doctor/Add'}>Add</GroupLink>
                </GroupLinksContainer>
            </Group>

            <Group>
                <GroupTitle>Subjects!</GroupTitle>
                <GroupLinksContainer>
                    <GroupLink to={'/Subject'}>List</GroupLink>
                    <GroupLink to={'/Subject/Add'}>Add</GroupLink>
                    <GroupLink to={'/Subject/Templates'}>Templates</GroupLink>
                </GroupLinksContainer>
            </Group>

            <Group>
                <GroupTitle>Mails!</GroupTitle>
                <GroupLinksContainer>
                    <GroupLink to={'/Mail/Sent'}>Sent</GroupLink>
                    <GroupLink to={'/Mail/Inbox'}>Inbox</GroupLink>
                </GroupLinksContainer>
            </Group>
            
            <Group>
                <GroupTitle>Students!</GroupTitle>
                <GroupLinksContainer>
                    <GroupLink to={'/Student'}>List</GroupLink>
                    <GroupLink to={'/Student/Add'}>Add</GroupLink>
                </GroupLinksContainer>
            </Group>
        </GroupsContainer>
    </div>)
}

export default AdminDashboard