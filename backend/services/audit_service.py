from database.models import AuditLog


def add_audit_log(
    db,
    project_id: str,
    actor: str,
    actor_role: str,
    action: str,
    entity_type: str,
    entity_id: str,
    detail: str = "",
    old_value: str = None,
    new_value: str = None,
):
    """Append an immutable audit event. Do not delete audit logs."""

    log = AuditLog(
        project_id=project_id,
        actor=actor,
        actor_role=actor_role,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        detail=detail,
        old_value=old_value,
        new_value=new_value,
    )
    db.add(log)
    return log
