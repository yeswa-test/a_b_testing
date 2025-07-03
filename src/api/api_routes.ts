import { EventLogService } from "../event_log_service/event_log_service";
import { TestService } from "../test_service/test_service";
import { UserService } from "../user_service/user_service"

export const applyProductionRoutes = function (app) {
    app.route("/fetch_create_user").post(UserService.ioCreateUser);
    app.route("/log_event").post(EventLogService.ioLogEvent);
    app.route("/test/add").post(TestService.ioAddTest);
} 