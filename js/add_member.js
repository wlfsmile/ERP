$(function(){
	// 请求队长信息
	var str='';
	$.ajax({
		url : "http://rapapi.org/mockjsdata/22245/leaderInfo",
		type : "GET",
		success : function(data){
			str =   '<div class="addBox">'+
						'<div class="addBox_title">添加成员<span class="addCancel">×</span></div>'+
						'<div class="addBox_content">'+
						    '<p>'+
						        '队长姓名：<input name="name" type="text" value="'+ data.name +'" readonly="readonly"  /> '+
						    '</p>'+
						    '<p>'+
						        '学号：<input name="schoolId" type="text" value="'+ data.schoolId +'" readonly="readonly"  /> '+
						    '</p>'+
						    '<p>'+
						        '职务：<input name="post" type="text" value="'+ data.post +'" readonly="readonly"  /> '+
						    '</p>'+
						    '<div class="memberInfo">'+
						    '</div>'+
						    '<button class="btn btn_next">添加成员</button>'+
						    '<button class="btn btn_keep">保存添加</button>'+
					    '</div>'+	
				    '</div>';
		},
		error : function(){
			alert("请求失败");
		}
	})

	// 点击头像添加成员
	$('.tab_td3').click(function(){
		$('.addMember').html(str)
		// 点击x
		$('.addCancel').click(function(){
			$('.addBox').remove();
		})
		// 点击添加成员，添加from
		$('.btn_next').on('click',function(){
			var addMemberStr = '';
			addMemberStr = '<div class="memberInfo_i">'+
							    '<p>'+
							        '队员姓名：<input name="name" type="text"  />'+
							    '</p>'+
							    '<p>'+
							        '学号：<input name="schoolId" type="text"  />'+
							    '</p>'+
							    '<p>'+
							        '职务：<input name="post" type="text"  />'+
							    '</p>'+
							    '<p>'+
							        '贡献排名：<input name="rank" type="text" class="rank" />'+
							    '</p>'+
							    '<button class="btn btn_remove">删除成员</button>'+
						    '</div>';
			$('.memberInfo').append(addMemberStr);
			// 点击删除成员
			$('.btn_remove').click(function(){
				$(this).parent(".memberInfo_i").remove();
			})
		})
	})
})