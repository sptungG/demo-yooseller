import { useUpdateStateOfProviderMutation } from "src/redux/query/provider.query";
import useApp from "./useApp";
import useChangeLocale from "./useChangeLocale";

function useUpdateStateStore() {
  const { message } = useApp();
  const { i18n } = useChangeLocale();
  const [mutateStateStore, {}] = useUpdateStateOfProviderMutation();

  const mutateState = ({ id, state }: { id?: number; state?: number }) => {
    if (!!id && !!state)
      mutateStateStore({ id, state })
        .unwrap()
        .then(({ result }) => {
          if (state === 1) message.warning(i18n["Ngừng kinh doanh cửa hàng thành công"]);
          if (state === 2) message.success(i18n["Mở kinh doanh cửa hàng thành công"]);
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi cập nhật cửa hàng"]);
        });
  };

  return { mutateState };
}

export default useUpdateStateStore;
