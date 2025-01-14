import { TAmenitiesState } from "@/types/amenity.types";
import { TBState } from "src/types/booking.types";
import {
  TEEcoFarmPackageActivityStatus,
  TItemStatus as TEcofarmItemStatus,
  TPackageStatus,
  TProviderEcoFarmState,
  TRegisterStatus,
  TStateTrackingOrderFarm,
  TStatusOrder,
} from "src/types/farm.types";
import { TItemStatus } from "src/types/item.types";
import { TStateOrder, TStateTrackingOrder } from "src/types/order.types";
import { TProviderState } from "src/types/provider.types";
import useChangeLocale from "./useChangeLocale";

function useStateConf() {
  const { i18n } = useChangeLocale();

  const mappedItemStateConf = (state: TItemStatus) => {
    switch (state) {
      case TItemStatus.PENDING:
        return {
          color: "gray",
          label: i18n["Chờ duyệt"],
        };
      case TItemStatus.ACTIVATED:
        return {
          color: "green",
          label: i18n["Đang hoạt động"],
        };
      case TItemStatus.DEBOOSTED:
        return {
          color: "orange",
          label: "",
        };
      case TItemStatus.BANNED:
        return {
          color: "red",
          label: i18n["Đã chặn"],
        };
      case TItemStatus.DELETED_BY_ADMIN:
        return {
          color: "red",
          label: i18n["Xóa bởi Admin"],
        };
      case TItemStatus.DELETED:
        return {
          color: "red",
          label: i18n["Đã xóa"],
        };
      case TItemStatus.HIDDEN:
        return {
          color: "gray",
          label: i18n["Đã ẩn"],
        };
      case TEcofarmItemStatus.INACTIVED:
        return {
          color: "red",
          label: i18n["Ngừng kinh doanh"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };
  const mappedEcofarmItemStatusConf = (state: TEcofarmItemStatus) => {
    switch (state) {
      case TEcofarmItemStatus.PENDING:
        return {
          color: "gray",
          label: i18n["Chờ duyệt"],
        };
      case TEcofarmItemStatus.ACTIVATED:
        return {
          color: "green",
          label: i18n["Đang hoạt động"],
        };
      case TEcofarmItemStatus.DEBOOSTED:
        return {
          color: "orange",
          label: "Vi phạm",
        };
      case TEcofarmItemStatus.BANNED:
        return {
          color: "red",
          label: i18n["Đã chặn"],
        };
      case TEcofarmItemStatus.DELETED_BY_ADMIN:
        return {
          color: "red",
          label: i18n["Xóa bởi Admin"],
        };
      case TEcofarmItemStatus.DELETED:
        return {
          color: "red",
          label: i18n["Đã xóa"],
        };
      case TEcofarmItemStatus.HIDDEN:
        return {
          color: "gray",
          label: i18n["Đã ẩn"],
        };
      case TEcofarmItemStatus.INACTIVED:
        return {
          color: "red",
          label: i18n["Ngừng kinh doanh"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };
  //
  const mappedProviderStateConf = (state: TProviderState) => {
    switch (state) {
      case TProviderState.PENDING:
        return {
          color: "gray",
          label: i18n["Chờ duyệt"],
        };
      case TProviderState.ACTIVATED:
        return {
          color: "green",
          label: i18n["Đang hoạt động"],
        };
      case TProviderState.INACTIVATED:
        return {
          color: "gray",
          label: i18n["Ngừng kinh doanh"],
        };
      case TProviderState.BLOCKED:
        return {
          color: "red",
          label: i18n["Đã chặn"],
        };
      case TProviderState.HIDDEN:
        return {
          color: "gray",
          label: i18n["Đã ẩn"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };
  //
  const mappedBookingStateConf = (state: TBState) => {
    switch (state) {
      case TBState.WAIT_FOR_CONFIRM:
        return {
          color: "gray",
          label: i18n["Chờ xác nhận"],
        };
      case TBState.CONFIRMED:
        return {
          color: "blue",
          label: i18n["Đã xác nhận"],
        };
      case TBState.USER_COMPLETED:
        return {
          color: "green",
          label: i18n["Ng.đặt hoàn thành"],
        };
      case TBState.CANCELLATION:
        return {
          color: "gray",
          label: i18n["Đã huỷ"],
        };
      case TBState.CANCELLATION_TO_RESPOND:
        return {
          color: "gray",
          label: i18n["Yêu cầu huỷ"],
        };
      case TBState.CANCELLATION_CANCELLED:
        return {
          color: "red",
          label: i18n["Đã xác nhận huỷ"],
        };
      case TBState.RETURN_REFUND:
        return {
          color: "red",
          label: i18n["Yêu cầu hoàn đơn"],
        };
      case TBState.RETURN_REFUND_NEW_REQUEST:
        return {
          color: "red",
          label: i18n["Hoàn đơn"],
        };
      case TBState.RETURN_REFUND_RESPONDED:
        return {
          color: "red",
          label: i18n["Đã phản hồi hoàn đơn"],
        };
      case TBState.RETURN_REFUND_COMPLETED:
        return {
          color: "red",
          label: i18n["Đã hoàn đơn"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };
  //
  const mappedOrderStateConf = (state: TStateOrder) => {
    switch (state) {
      case TStateOrder.TO_CONFIRM:
        return {
          color: "gray",
          label: i18n["Chờ xác nhận"],
        };
      case TStateOrder.TO_SHIP_TO_PROCESS:
        return {
          color: "blue",
          label: i18n["Đã xác nhận, đang chuẩn bị"],
        };
      case TStateOrder.TO_SHIP_PROCESSED:
        return {
          color: "blue",
          label: i18n["Đã chuẩn bị, chờ vận chuyển"],
        };
      case TStateOrder.SHIPPING:
        return {
          color: "blue",
          label: i18n["Đang giao"],
        };
      case TStateOrder.SHIPPER_COMPLETED:
        return {
          color: "blue",
          label: i18n["Shipper hoàn thành giao"],
        };
      case TStateOrder.USER_COMPLETED:
        return {
          color: "green",
          label: i18n["Ng. nhận hoàn thành đơn"],
        };
      case TStateOrder.USER_RATED:
        return {
          color: "green",
          label: i18n["Ng. nhận đã đánh giá"],
        };
      case TStateOrder.CANCELLATION_TO_RESPOND:
        return {
          color: "gray",
          label: i18n["Yêu cầu huỷ"],
        };
      case TStateOrder.CANCELLATION_CANCELLED:
        return {
          color: "red",
          label: i18n["Đã xác nhận huỷ đơn"],
        };
      case TStateOrder.RETURN_REFUND_NEW_REQUEST:
        return {
          color: "red",
          label: i18n["Yêu cầu hoàn đơn"],
        };
      case TStateOrder.RETURN_REFUND_TO_RESPOND:
        return {
          color: "red",
          label: i18n["Hoàn đơn"],
        };
      case TStateOrder.RETURN_REFUND_RESPONDED:
        return {
          color: "red",
          label: i18n["Đã phản hồi hoàn đơn"],
        };
      case TStateOrder.RETURN_REFUND_COMPLETED:
        return {
          color: "red",
          label: i18n["Đã hoàn đơn"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };
  const mappedOrderStateTrackingConf = (state: TStateTrackingOrder) => {
    switch (state) {
      case TStateTrackingOrder.ORDER_PLACED:
        return {
          color: "gray",
          label: i18n["Đặt đơn thành công"],
        };
      case TStateTrackingOrder.PREPARING_TO_SHIP:
        return {
          color: "blue",
          label: i18n["Đang chuẩn bị giao"],
        };
      case TStateTrackingOrder.SHIPPING:
        return {
          color: "blue",
          label: i18n["Đang giao hàng"],
        };
      case TStateTrackingOrder.DELIVERED:
        return {
          color: "green",
          label: i18n["Giao hàng thành công"],
        };
      case TStateTrackingOrder.CANCELLED:
        return {
          color: "red",
          label: i18n["Đã huỷ đơn"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };

  const mappedPackageItemStateConf = (state: TPackageStatus) => {
    switch (state) {
      case TPackageStatus.ACTIVATED:
        return {
          color: "green",
          label: i18n["Đang đầu tư"],
        };

      case TPackageStatus.CLOSED:
        return {
          color: "gray",
          label: i18n["Đã đóng"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };

  const mappedProviderEcoFarmStateConf = (state: TProviderEcoFarmState) => {
    switch (state) {
      case TProviderEcoFarmState.PENDING:
        return {
          color: "gray",
          label: i18n["Chờ duyệt"],
        };
      case TProviderEcoFarmState.ACTIVATED:
        return {
          color: "green",
          label: i18n["Đang hoạt động"],
        };
      case TProviderEcoFarmState.INACTIVATED:
        return {
          color: "gray",
          label: i18n["Không hoạt động"],
        };
      case TProviderEcoFarmState.BLOCKED:
        return {
          color: "red",
          label: i18n["Đã khóa"],
        };
      case TProviderEcoFarmState.HIDDEN:
        return {
          color: "gray",
          label: i18n["Đã ẩn"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };
  const mappedEcoFarmRegisterStatusConf = (state: TRegisterStatus) => {
    switch (state) {
      case TRegisterStatus.PENDING_APPROVAL:
        return {
          color: "warning",
          label: i18n["Chờ duyệt"],
        };
      case TRegisterStatus.CANCELLED:
        return {
          color: "red",
          label: i18n["Từ chối"],
        };
      case TRegisterStatus.INVESTING:
        return {
          color: "success",
          label: i18n["Đang đầu tư"],
        };
      case TRegisterStatus.COMPLETED:
        return {
          color: "green",
          label: i18n["Hoàn thành"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };
  const mappedOrderStateFarmConf = (state: TStatusOrder) => {
    switch (state) {
      case TStatusOrder.TO_CONFIRM:
        return {
          color: "gray",
          label: i18n["Chờ xác nhận"],
        };
      case TStatusOrder.TO_SHIP_TO_PROCESS:
        return {
          color: "blue",
          label: i18n["Đã xác nhận, đang chuẩn bị"],
        };
      case TStatusOrder.TO_SHIP_PROCESSED:
        return {
          color: "blue",
          label: i18n["Đã chuẩn bị, chờ vận chuyển"],
        };
      case TStatusOrder.SHIPPING:
        return {
          color: "blue",
          label: i18n["Đang giao hàng"],
        };
      case TStatusOrder.SHIPPER_COMPLETED:
        return {
          color: "blue",
          label: i18n["Giao hàng thành công"],
        };
      case TStatusOrder.USER_COMPLETED:
        return {
          color: "green",
          label: i18n["Ng. nhận hoàn thành đơn"],
        };
      case TStatusOrder.USER_RATED:
        return {
          color: "green",
          label: i18n["Ng. nhận đã đánh giá"],
        };
      case TStatusOrder.CANCELLATION_TO_RESPOND:
        return {
          color: "gray",
          label: i18n["Yêu cầu huỷ"],
        };
      case TStatusOrder.CANCELLATION_CANCELLED:
        return {
          color: "red",
          label: i18n["Đã xác nhận huỷ đơn"],
        };
      case TStatusOrder.RETURN_REFUND_NEW_REQUEST:
        return {
          color: "red",
          label: i18n["Yêu cầu hoàn đơn"],
        };
      case TStatusOrder.RETURN_REFUND_TO_RESPOND:
        return {
          color: "red",
          label: i18n["Hoàn đơn"],
        };
      case TStatusOrder.RETURN_REFUND_RESPONDED:
        return {
          color: "red",
          label: i18n["Đã phản hồi hoàn đơn"],
        };
      case TStatusOrder.RETURN_REFUND_COMPLETED:
        return {
          color: "red",
          label: i18n["Đã hoàn đơn"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };
  const mappedOrderStateFarmTrackingConf = (state: TStateTrackingOrderFarm) => {
    switch (state) {
      case TStateTrackingOrderFarm.ORDER_PLACED:
        return {
          color: "gray",
          label: i18n["Đặt đơn thành công"],
        };
      case TStateTrackingOrderFarm.PREPARING_TO_SHIP:
        return {
          color: "blue",
          label: i18n["Đang chuẩn bị"],
        };
      case TStateTrackingOrderFarm.SHIPPING:
        return {
          color: "blue",
          label: i18n["Đang giao hàng"],
        };
      case TStateTrackingOrderFarm.DELIVERED:
        return {
          color: "green",
          label: i18n["Giao hàng thành công"],
        };
      case TStateTrackingOrderFarm.CANCELLED:
        return {
          color: "red",
          label: i18n["Đã huỷ đơn"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };
  const mappedEcofarmActivityStatusConf = (status: TEEcoFarmPackageActivityStatus) => {
    switch (status) {
      case TEEcoFarmPackageActivityStatus.ONGOING:
        return {
          color: "red",
          label: i18n["Sắp diễn ra"],
        };
      case TEEcoFarmPackageActivityStatus.ACTIVATED:
        return {
          color: "green",
          label: i18n["Đang diễn ra"],
        };
      case TEEcoFarmPackageActivityStatus.COMPLETED:
        return {
          color: "default",
          label: i18n["Đã hoàn thành - kết thúc"],
        };
      case TEEcoFarmPackageActivityStatus.CANCELED:
        return {
          color: "gray",
          label: i18n["Đã hủy"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };

  const mappedAmenitiesBookingStateConf = (state: TAmenitiesState) => {
    switch (state) {
      case TAmenitiesState.USER_REQUESTED:
        return {
          color: "gray",
          label: i18n["Đã yêu cầu"],
        };
      case TAmenitiesState.USER_REQUESTED_WITH_PAY_DEPOSIT:
        return {
          color: "blue",
          label: i18n["Đã đặt cọc"],
        };
      case TAmenitiesState.USER_REQUESTED_WITH_PAY_ALL:
        return {
          color: "green",
          label: i18n["Đã thanh toán"],
        };
      case TAmenitiesState.USER_CANCELED:
        return {
          color: "red",
          label: i18n["Yêu cầu huỷ"],
        };
      // case TAmenitiesState.USER_PAID:
      //   return {
      //     color: "red",
      //     label: i18n["Đã thanh toán"],
      //   };
      case TAmenitiesState.USER_RATED:
        return {
          color: "yellow",
          label: i18n["Đã đánh giá"],
        };
      case TAmenitiesState.PROVIDER_ACCEPTED:
        return {
          color: "blue",
          label: i18n["Đang xử lý"],
        };
      case TAmenitiesState.PROVIDER_REJECTED:
        return {
          color: "red",
          label: i18n["Đã hủy"],
        };
      case TAmenitiesState.PROVIDER_COMPLETED:
        return {
          color: "green",
          label: i18n["Đã hoàn thành"],
        };
      default:
        return {
          color: "gray",
          label: "______",
        };
    }
  };
  return {
    mappedOrderStateTrackingConf,
    mappedOrderStateConf,
    mappedProviderStateConf,
    mappedBookingStateConf,
    mappedItemStateConf,
    mappedProviderEcoFarmStateConf,
    mappedEcofarmItemStatusConf,
    mappedEcoFarmRegisterStatusConf,
    mappedOrderStateFarmConf,
    mappedOrderStateFarmTrackingConf,
    mappedEcofarmActivityStatusConf,
    mappedAmenitiesBookingStateConf,
  };
}

export default useStateConf;
