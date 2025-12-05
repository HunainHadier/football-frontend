
export const ROLES = {
    ADMIN: "ADMIN",
    COACH: "COACH",
};


export const PERMISSIONS = {
    manageCoaches: [ROLES.ADMIN],                 // add/edit/delete coaches
    viewReports: [ROLES.ADMIN],                   // admin only
    managePlayers: [ROLES.ADMIN, ROLES.COACH],    // both can manage players
    manageMatches: [ROLES.ADMIN, ROLES.COACH],    // both can manage matches
};


export const hasPermission = (role, permission) => {
    const allowedRoles = PERMISSIONS[permission];
    return allowedRoles?.includes(role?.toLowerCase());
};
