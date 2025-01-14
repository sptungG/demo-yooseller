import { useUpdateStateOfProviderEcoFarmMutation } from "src/redux/query/farm.query";
import useApp from "./useApp";
import useChangeLocale from "./useChangeLocale";

function useUpdateStateFarm() {
  const { message } = useApp();
  const { i18n } = useChangeLocale();
  const [mutateStateFarm, {}] = useUpdateStateOfProviderEcoFarmMutation();

  const mutateState = ({ id, state }: { id?: number; state?: number }) => {
    if (!!id && !!state)
      mutateStateFarm({ id, state })
        .unwrap()
        .then(() => {
          if (state === 1) message.warning(i18n["Ngừng kinh doanh trang trại thành công"]);
          if (state === 2) message.success(i18n["Mở kinh doanh trang trại thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi cập nhật trang trại"]);
        });
  };

  return { mutateState };
}

export default useUpdateStateFarm;
