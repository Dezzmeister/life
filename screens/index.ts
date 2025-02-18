import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActiveQuestList } from "./ActiveQuestList";
import { createStaticNavigation, type StaticParamList } from "@react-navigation/native";
import { CreateQuest } from "./CreateQuest";
import { CompletedQuestList } from "./CompletedQuestList";

const RootStack = createNativeStackNavigator({
    initialRouteName: "ActiveQuestList",
    screenOptions: {
        headerShown: false
    },
    screens: {
        CompletedQuestList,
        ActiveQuestList,
        CreateQuest: {
            screen: CreateQuest,
            options: {
                presentation: "modal"
            }
        }
    }
});

type RootStackParamList = StaticParamList<typeof RootStack>;

export const Navigation = createStaticNavigation(RootStack);

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
