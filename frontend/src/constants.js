export const ROLE = {
    globalAdministrator: 1,
    administrator: 2,
    teacher: 3,
    member: 4
}

export const ROLE_NAME = [
    "Global Administrator",
    "Administrator",
    "Teacher",
    "Member"
]

export function roleToName(roleId) {
    return ROLE_NAME[roleId-1];
}